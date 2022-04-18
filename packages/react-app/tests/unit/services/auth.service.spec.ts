import { SessionWithToken } from '@app/types/SessionExtended';
import * as service from '@app/services/auth.service';
import RoleCache, { IRoleCache } from '@app/models/RoleCache';
import { Document } from 'mongoose';
import { BANKLESS_ROLES } from '@app/constants/Roles';
import { customers } from '../../stubs/customers.stub';
import * as custService from '@app/services/customer.service';

const banklessCustomer = customers[0];
const BBBSCustomer = customers[1];
const customerId = banklessCustomer.customerId;

describe('Role caching', () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

  // used when mocking return values that don't exactly match
  type CoercedIRoleCache = IRoleCache & Document<IRoleCache>

  const noFlush = false;

  const mockBaseSession: SessionWithToken = {
  	accessToken: 'TestToken',
  	expires: new Date().toDateString(),
  	user: {
  		email: 'abc@xyz/com',
  		name: 'jordan',
  	},
  };
  const mockCacheInvalid: IRoleCache = {
  	tte: service.FIVE_MINUTES,
  	createdAt: new Date().getTime() - 6 * 60 * 1_000,
  	sessionHash: service.createSessionHash(mockBaseSession),
  	customerId,
  	roles: ['create-bounty', 'create-customer'],
  };

  const mockCacheValid: IRoleCache = {
  	...mockCacheInvalid,
  	createdAt: new Date().getTime(),
  	roles: ['create-bounty'],
  };

  it('Creates a hash of the session that changes when session changges', () => {
  	const modifiedSession: SessionWithToken = JSON.parse(JSON.stringify(mockBaseSession));
  	modifiedSession.accessToken = 'Token Changed';

  	const baseHash = service.createSessionHash(mockBaseSession);
  	const modifiedHash = service.createSessionHash(modifiedSession);
  	expect(baseHash).not.toEqual(modifiedHash);
  });

  it('Creates a hash of the session that stays same when session unchanged', () => {
  	const clonedSession = JSON.parse(JSON.stringify(mockBaseSession));
  	const baseHash = service.createSessionHash(mockBaseSession);
  	const clonedHash = service.createSessionHash(clonedSession);
  	expect(baseHash).toEqual(clonedHash);
  });

  it('Expires the cache after 5 minutes', () => {
  	const cachedSession = service.generateCacheObject(
  		service.createSessionHash(mockBaseSession),
  		['admin'],
  		customerId
  	);
  	expect(service.cacheExpired(cachedSession)).toEqual(false);
  	cachedSession.createdAt = new Date().getTime() - (4 * 60 * 1000);
  	expect(service.cacheExpired(cachedSession)).toEqual(false);
  	cachedSession.createdAt = new Date().getTime() - (5 * 60 * 1000 + 1);
  	expect(service.cacheExpired(cachedSession)).toEqual(true);
  });

  it('Returns the existing cache if valid and exists', async () => {
  	const mockCache: IRoleCache = {
  		tte: service.FIVE_MINUTES,
  		createdAt: new Date().getTime() - 2 * 60 * 1_000,
  		sessionHash: service.createSessionHash(mockBaseSession),
  		customerId,
  		roles: ['create-bounty', 'create-customer'],
  	};
  	// we don't care about mongoose methods for this test 
  	jest.spyOn(RoleCache, 'findOne')
  		.mockResolvedValue(mockCache as unknown as CoercedIRoleCache);

  	expect(await service.getPermissionsCached(mockBaseSession, customerId, noFlush)).toEqual(mockCache.roles);
  });

  it('Calls the create method if the cache does not exist', async () => {
  	jest.spyOn(RoleCache, 'findOne')
  		.mockResolvedValue(null);

  	const spy = jest.spyOn(service, 'createCache')
  		.mockResolvedValue(mockCacheValid);

  	await service.getPermissionsCached(mockBaseSession, customerId, noFlush);
  	expect(spy).toHaveBeenCalled();
  });

  it('Calls the create method if the cache exists but is invalid', async () => {

  	// we don't care about mongoose methods for this test 
  	jest.spyOn(RoleCache, 'findOne')
  		.mockResolvedValue(mockCacheInvalid as unknown as CoercedIRoleCache);
  	const spy = jest.spyOn(service, 'createCache')
  		.mockResolvedValue(mockCacheValid);

  	await service.getPermissionsCached(mockBaseSession, customerId, noFlush);
  	expect(spy).toHaveBeenCalled();
  });
});

describe('Permissions', () => {

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Base permissions are returned for all bankless L1-4', async () => {
		jest.spyOn(custService, 'getCustomer').mockResolvedValue(banklessCustomer);
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue([BANKLESS_ROLES.LEVEL_1]);

		let permissions = await service.getPermissions('', banklessCustomer.customerId);

		expect(permissions).toEqual(service.baseRoles);

		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue([BANKLESS_ROLES.LEVEL_2]);

		permissions = await service.getPermissions('', banklessCustomer.customerId);
		expect(permissions).toEqual(service.baseRoles);

		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue([
				BANKLESS_ROLES.LEVEL_3,
				BANKLESS_ROLES.LEVEL_4,
			]);
		
		permissions = await service.getPermissions('', banklessCustomer.customerId);
		expect(permissions).toEqual(service.baseRoles);
		
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue([BANKLESS_ROLES.LEVEL_4]);

		permissions = await service.getPermissions('', banklessCustomer.customerId);
		expect(permissions).toEqual(service.baseRoles);
	});

	it('Admins are added for BB core', async () => {
		jest.spyOn(custService, 'getCustomer').mockResolvedValue(banklessCustomer);
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue([BANKLESS_ROLES.BB_CORE]);
		const permissions = await service.getPermissions('', banklessCustomer.customerId);
		expect(permissions).toEqual(['admin']);
	});

	it('Custom roles for Dev Guild', async () => {
		jest.spyOn(custService, 'getCustomer').mockResolvedValue(banklessCustomer);
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue([BANKLESS_ROLES.DEV_GUILD]);
		const permissions = await service.getPermissions('', banklessCustomer.customerId);
		expect(permissions).toEqual(['create-bounty', 'edit-bounties']);
	});

	it('All of BBBS are admins', async () => {
		jest.spyOn(custService, 'getCustomer').mockResolvedValue(BBBSCustomer);
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue(['anything']);
		const permissions = await service.getPermissions('', BBBSCustomer.customerId);
		expect(permissions).toEqual(['admin']);
	});

	it('No permission added for unknown role', async () => {
		const getCustomerSpy = jest.spyOn(custService, 'getCustomer').mockResolvedValue(banklessCustomer);
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue(['123344566']);
		const permissions = await service.getPermissions('', banklessCustomer.customerId);
		expect(permissions).toEqual([]);
		expect(getCustomerSpy).toBeCalled();
	});

	it('No permission added for empty customer ID', async () => {
		jest.spyOn(custService, 'getCustomer').mockResolvedValue(null);
		const getRolesSpy = jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue(['123344566']);
		const permissions = await service.getPermissions('', '');
		expect(permissions).toEqual([]);
		expect(getRolesSpy).not.toBeCalled();
	});

	it('No permission added for customer with no permissions defined', async () => {
		const getCustomerSpy = jest.spyOn(custService, 'getCustomer').mockResolvedValue(customers[2]);
		jest.spyOn(service, 'getRolesForUserInGuild')
			.mockResolvedValue(['123344566']);
		const permissions = await service.getPermissions('', customers[2].customerId);
		expect(permissions).toEqual([]);
		expect(getCustomerSpy).toBeCalled();
	});
});