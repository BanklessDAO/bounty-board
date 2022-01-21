import { Controller, SubmitHandler, useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useContext, useEffect, useState } from 'react';
import  { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import DatePicker from "@app/components/parts/DatePicker";
import { Box, Heading, HStack, Stack, Text } from '@chakra-ui/layout';
import Layout from '@app/components/global/SiteLayout'
import {
  InfoIcon,
} from '@chakra-ui/icons'
import {
	FormErrorMessage,
	FormLabel,
	FormControl,
	Input,
	Button,
  AccordionPanel,
  Select,
  Accordion, 
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Flex,
  Switch,
  FormControlProps,
  FormHelperText,
	Textarea,
} from '@chakra-ui/react';
import Bounty, { BountyCollection, BountySchema, Status } from '@app/models/Bounty';
import { filterGuildsToCustomers } from '@app/services/customer.service';
import { FaFileVideo } from 'react-icons/fa';
import bountyStatus from '@app/constants/bountyStatus';
import { CustomerContext } from '@app/context/CustomerContext';
import { User } from 'next-auth';
import { APIUser } from 'discord-api-types'
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRoles } from '@app/hooks/useRoles';
import Page400 from './400';

const useCurrencies = (): string[] => {
  return ['BANK'];  
}

const defaultValues = {
  title: '',
  description: '',
  reward: '1000',
  currency: 'BANK',
  criteria: '',
  dueAt: new Date().toISOString(),
  gatedTo: '',
  multiClaim: false,
  evergreen: false,
} 

const ExpansionField = ({
  label, children, value, onChange
}: {
  label: string,
  children: React.ReactNode,
  value: boolean,
  onChange: (value: boolean) => void
}) => {
  return (
    <Accordion 
    w="full"
    allowToggle        
  >
    <AccordionItem
    >
      <AccordionButton 
        onClick={() => {
          onChange(value = !value)
        }}
        display="flex"
        justifyContent="space-between"
      >
      <FormLabel htmlFor='multiclaimant' mb='0'>
        { label }
      </FormLabel>
        <Box
          borderRadius="50%"
          bg={value ? "green": ""}
          border="2px solid"
          borderColor={value ? "green" : "lightBlue"}
          width="12px"
          height="12px"
        />
      </ AccordionButton>
      <AccordionPanel pb={4}>
        { children }
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
  )
}

type LocalStorageReturn<T extends any> = {
  loading: boolean;
  data: T | undefined
}

export function useLocalStorage<T>(key: string): LocalStorageReturn<T> {
  let data = undefined;
  let loading = true;
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem(key);
    if (item) data = JSON.parse(item);
    loading = false;
  } 
  return { loading, data }
}

const dateIsNotInPast = (d: string): string | boolean => {
  const dt = new Date(d).getTime();
  const today = new Date();
  const todayAtMidnight = today.setHours(0,0,0,0);
  const validDate = (dt - todayAtMidnight) >= 0;
  return validDate ? true : 'Cannot set a date in the past'
}

const validNonNegativeDecimal = (v: string): string | boolean => {
    if (!Number(v)) return 'Not a valid reward'
    return Number(v) > 0 ? true : 'Must be > 0'
}

const required = 'This field is required';

const NotNeededFields = [
  '_id',
  'claimedBy', 
  'submissionNotes',
  'submissionUrl',
  'season',
  'claimedAt',
  'submittedAt',
  'reviewedAt',
  'reviewedBy',
  'submittedBy'
] as const

const useDefaultValues = () => {
  const { loading, data: cachedBounty } = useLocalStorage<typeof defaultValues>('cachedEdit');
  return cachedBounty ?? defaultValues;
}

const generatePreviewData = (data: typeof defaultValues, customer_id: string, user: APIUser): Omit<BountyCollection, typeof NotNeededFields[number]> => {
  const amount = Number(data.reward);
  const decimalSplit = data.reward.split('.');
  const hasDecimals = decimalSplit.length > 1
  const amountWithoutScale = hasDecimals ? Number(decimalSplit.join('')) : amount;
  const scale = hasDecimals ? decimalSplit[1].length : 0; 
  return {  
    title: data.title,
    description: data.description,
    criteria: data.criteria,
    customer_id,
    status: bountyStatus.DRAFT,
    dueAt: new Date(data.dueAt).toISOString(),
    reward: {
      amount,
      currency: data.currency.toUpperCase(),
      amountWithoutScale,
      scale,
    },
    editKey: `edit-${user.id}`,
    statusHistory: [
      {
        status: bountyStatus.DRAFT,
        modifiedAt: new Date().toISOString()
      }
    ],
    discordMessageId: '',
    createdAt: new Date().toISOString(),
    createdBy: {
      discordHandle: `${user.username}#${user.discriminator}`,
      discordId: user.id
    }
  }
}

export const tokenFetcher = (url: string, token: string) => axios.get(
	url,
	{
		headers: {
			authorization: `Bearer ${token}`,
		},
	}
).then(res => res.data).catch(error => console.warn(error));

const useUser = (): {
  loading: boolean;
  user?: APIUser
} => {
  const { data: session } = useSession({ required: false });
  const { data: user, error } = useSWR<APIUser, unknown>(session
    ? ['https://discord.com/api/users/@me', session.accessToken]
    : null
  , tokenFetcher)
  return { 
    loading: !error && !user,
    user
  }
}

const PLACEHOLDERS = {
  TITLE: 'Example: Create new Logo',
  DESCRIPTION: 'Example: We need someone to create some snappy looking logos for our new Web3 project.',
  CRITERIA: 'Example: SVG and PNG images approved by the team'
}

const Form = () => {
  const { status } = useSession({ required: false })
  const router = useRouter();
  const unauthorized = (status !== 'loading' && status !== 'authenticated')
  const { user } = useUser();
  const cachedBounty = useDefaultValues();
  const currencies = useCurrencies();
  const { customer: { customer_id } } = useContext(CustomerContext);
  const formControlProps: FormControlProps = { mt: '5'};
  const [gated, setGated] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: cachedBounty,
  })
  return (
    <Layout title={unauthorized ? 'Not Authorized' : "Create a new Bounty"}>
    {
      unauthorized
      ?	(
        <Stack align="center" justify="center" h="400px">
			    <Heading size="4xl" align="center">
			    	<strong>400</strong>
			    </Heading>
			    <Heading size="xl">Unauthorized - Sign In to Access</Heading>
		    </Stack> 
        )
      : <form onSubmit={handleSubmit(data => {
          let _data: Partial<typeof data>;
          const preview = user && generatePreviewData(data, customer_id, user);
          console.debug({preview})
          localStorage.setItem('cachedEdit', JSON.stringify(data))
          localStorage.setItem('previewBounty', JSON.stringify(preview))
          router.push('/preview')
        })}>
        <FormControl
          isInvalid={!!errors.title}
          {...formControlProps}
          >
          <FormLabel htmlFor='title'>Bounty Title</FormLabel>
          <Box
            bg="rgba(0,0,0,0.2)"
            p="4"
            my="2"
          >Give the bounty a catchy title</Box>
          <Input
            id='title'
            placeholder={PLACEHOLDERS.TITLE}
            {...register('title', { required }) }
            />
          <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!errors.description}
          {...formControlProps}
          >
          <FormLabel htmlFor='description'>Description</FormLabel>
          <Box
            bg="rgba(0,0,0,0.2)"
            p="4"
            my="2"
          >Provide a brief description of the bounty</Box>
          <Textarea
            id='description'
            placeholder={PLACEHOLDERS.DESCRIPTION}
            {...register('description') }/>
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!errors.criteria}
          {...formControlProps}
          >
          <FormLabel htmlFor='criteria'>Criteria</FormLabel>
          <Box
            bg="rgba(0,0,0,0.2)"
            p="4"
            my="2"
          >What is absolutely required before the bounty will be considered complete?</Box>        
          <Textarea
            id='criteria' 
            placeholder={PLACEHOLDERS.CRITERIA}
            {...register('criteria', { required }) }
            />
          <FormErrorMessage>{errors.criteria?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={!!errors.dueAt}
          {...formControlProps}
        >
        <FormLabel htmlFor="dueAt"
          mr="0"
          >
          Due At
          </FormLabel>
          <Controller
            name="dueAt"
            control={control}
            rules={{
              required,
              validate: v => dateIsNotInPast(v)
            }}
            render={({ field }) => 
              <DatePicker
                selected={new Date(field.value)}
                onChange={d => field.onChange(d)}
                id="published-date"
                showPopperArrow={true}
              />
            }
          />
          <FormErrorMessage>{errors.dueAt?.message}</FormErrorMessage>
      </FormControl>

      <Flex>
        <FormControl
          {...formControlProps}
          isInvalid={!!errors.reward}
          mr="1"
          >
          <FormLabel htmlFor='reward'>Reward</FormLabel>
          <Input id='reward' {...register('reward', {
              required, validate: (v: string) => validNonNegativeDecimal(v)
            })} />
          <FormErrorMessage>{errors.reward?.message}</FormErrorMessage>
        </FormControl>

        <FormControl
          {...formControlProps}
          isInvalid={!!errors.currency}
          >
          <FormLabel htmlFor='currency'>Currency</FormLabel>
          <Select id='currency' {...register('currency', { required })}>
            {currencies.map(c => <option key={c}>{c.toUpperCase()}</option>)}
          </Select>
          <FormErrorMessage>{errors.currency?.message}</FormErrorMessage>
        </FormControl>
      </Flex>

      <FormControl
        bg="rgba(0,0,0,0.2)"
        {...formControlProps}
      >
        <Controller
          name="multiClaim"
          control={control}   
          render={({ field }) =>  
            <ExpansionField
              onChange={field.onChange}
              value={field.value}
              label="Allow Multiple Claimants?"
              >
              <FormControl>
                <Flex mb="3" alignItems="center">
                <InfoIcon mr="3"/>
                    <Text
                      p="0"
                      m="0"
                      fontSize="12"
                      fontStyle="italic"
                    >
                     Multiple People will be able to claim the bounty
                </Text>
              </Flex>            
              </FormControl>
            </ExpansionField>
          }
        />
      </FormControl>

      <FormControl
        bg="rgba(0,0,0,0.2)"
        {...formControlProps}
      >
         <Controller
            name="evergreen"
            control={control}   
            render={({ field }) =>  
              <ExpansionField 
                value={field.value}
                onChange={field.onChange}
                label="Recurring Bounty?"
                >
              <FormLabel htmlFor='evergreen'></FormLabel>
                <Flex
                  // justifyContent="space-evenly"
                >
                  <InfoIcon mr="3"/>
                  <Text
                    p="0"
                    m="0"
                    fontSize="12"
                    fontStyle="italic"
                  >
                    A recurring bounty will automatically re-list once claimed
                  </Text>
                </Flex>
              </ExpansionField>
            } />
            </FormControl>

        <FormControl
          isInvalid={!!errors.gatedTo}
          bg="rgba(0,0,0,0.2)"
          {...formControlProps}
        >
              <ExpansionField
                value={gated}
                onChange={setGated} 
                label="Restrict Claimants?"
                >
                  <FormLabel htmlFor='gatedTo'>
                    <Flex
                      alignItems="start"
                    >
                      <InfoIcon mr="3"/>
                      <Text
                        p="0"
                        m="0"
                        fontSize="12"
                        fontStyle="italic"
                        overflowWrap="break-word"
                      >
                        Restrict the bounty to allow claiming only by certain users or roles
                      </Text>
                    </Flex>
                  </FormLabel>
                  <Select id='gatedTo' {...register('gatedTo', {
                    validate: v => {
                      if (gated) {
                       return (v && gated) ? true : required
                      } else {
                        return true 
                      }
                   }})}>
                    {currencies.map(c => <option key={c}>{c.toUpperCase()}</option>)}
                  </Select>
                  <FormErrorMessage>{errors.gatedTo?.message}</FormErrorMessage>
                </ExpansionField> 
          </FormControl>
        <Button
          mt="5"
          w="full" 
          type="submit"
          disabled={!user}
        >
          Preview
        </Button>
      </form>}
    </Layout>
  )
}

export default Form;
