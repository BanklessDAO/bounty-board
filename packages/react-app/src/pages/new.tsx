import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import DatePicker from "@app/components/parts/DatePicker";
import { Box, HStack, Text } from '@chakra-ui/layout';
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

const currencies = [
  'bank', 'eth', 'city'
]

const defaultValues = {
  title: 'Create a logo for the bountyboard',
  description: 'We need a sharp and stylish logo in the next couple of weeks',
  reward: '1000',
  currency: 'BANK',
  criteria: 'PNG and SVG images submitted and approved by the team',
  dueAt: new Date().toDateString(),
  gatedTo: '#level2',
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

const generatePreviewData = (data: typeof defaultValues): Omit<BountyCollection, typeof NotNeededFields[number]> => {
  const amount = Number(data.reward);
  const decimalSplit = data.reward.split('.');
  const hasDecimals = decimalSplit.length > 1
  const amountWithoutScale = hasDecimals ? Number(decimalSplit.join('')) : amount;
  const scale = hasDecimals ? decimalSplit[1].length : 0; 
  return {  
    title: data.title,
    description: data.description,
    criteria: data.criteria,
    customer_id: '',
    status: bountyStatus.DRAFT,
    dueAt: data.dueAt,
    reward: {
      amount,
      currency: data.currency.toUpperCase(),
      amountWithoutScale,
      scale,
    },
    editKey: '',
    statusHistory: [
      {
        status: bountyStatus.DRAFT,
        modifiedAt: new Date().toDateString()
      }
    ],
    discordMessageId: '',
    createdAt: new Date().toDateString(),
    createdBy: {
      discordHandle: '',
      discordId: ''
    }
  }
}

const Form = () => {
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
    defaultValues,
  })
  return (
    <Layout title="Create a new Bounty">
    <form onSubmit={handleSubmit(data => {
        let _data: Partial<typeof data>;
        // console.debug({ data });
        const preview = generatePreviewData(data);
        console.debug({preview})
      })}>
      <FormControl
        isInvalid={!!errors.title}
        {...formControlProps}
        >
        <FormLabel htmlFor='title'>Bounty Title</FormLabel>
        <Input id='title' {...register('title', { required }) }/>
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
        <Textarea id='description' {...register('description') }/>
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
      
      <FormControl
        isInvalid={!!errors.criteria}
        {...formControlProps}
        >
        <FormLabel htmlFor='criteria'>Criteria</FormLabel>
        <Textarea id='criteria' {...register('criteria', { required }) }/>
        <FormErrorMessage>{errors.criteria?.message}</FormErrorMessage>
      </FormControl>

      <FormControl
        isInvalid={!!errors.dueAt}
        {...formControlProps}
      >
        <FormLabel htmlFor="dueat"
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
              <FormLabel htmlFor='maxClaim'></FormLabel>
                <Flex
                  justifyContent="space-evenly"
                >
                  <InfoIcon mr="3" mt="1"/>
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
                      justifyContent="space-evenly"
                      alignItems="start"
                      px="1"
                    >
                      <InfoIcon mr="3" mt="1"/>
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
        >
          Preview
        </Button>
      </form>
    </Layout>
  )
}

export default Form;
