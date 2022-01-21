import { SubmitHandler, useForm } from 'react-hook-form';
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
import Bounty, { BountySchema } from '@app/models/Bounty';

const currencies = [
  'bank', 'eth', 'city'
]

const defaultValues = {
  title: 'Create a logo for the bountyboard',
  description: 'We need a sharp and stylish logo in the next couple of weeks',
  reward: 1000,
  currency: 'BANK',
  criteria: 'PNG and SVG images submitted and approved by the team',
  dueAt: new Date(),
  gated: '#level-2',
  multiClaim: false,
  evergreen: false,
} 

const ExpansionField = ({ label, children }: { label: string, children: React.ReactNode }) => {
  const [multi, setMulti] = useState(false);
  const toggleMulti = () => setMulti(!multi);
  return (
    <Accordion 
    w="full"
    allowToggle        
  >
    <AccordionItem
    >
      <AccordionButton 
        onClick={() => toggleMulti()}
        display="flex"
        justifyContent="space-between"
      >
      <FormLabel htmlFor='multiclaimant' mb='0'>
        { label }
      </FormLabel>
        <Box
          borderRadius="50%"
          bg={multi ? "green": ""}
          border="2px solid"
          borderColor={multi ? "green" : "lightBlue"}
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

const required = 'This field is required';

const BountyCreateSchema = yup.object().shape({
  title: yup
    .string()
    .required('Please provide a title for this Bounty.')
    .max(250, 'Title cannot be more than 250 characters'),
  description: yup
    .string()
    .required('Please provide the bounty description')
    .max(4000, 'Description cannot be more than 4000 characters'),
  criteria: yup
    .string()
    .required('Please provide the bounty criteria')
    .max(4000, 'Criteria cannot be more than 4000 characters'),
  rewardAmount: yup
    .number()
    .typeError('Invalid number')
    .positive()
    .required('Please provide the bounty reward amount'),
});

const Form = () => {
  const formControlProps: FormControlProps = { mt: '5'};
  const [dueAt, setDueAt] = useState<Date>(new Date());
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    defaultValues,
    resolver: yupResolver(BountyCreateSchema)
  })
  return (
    <Layout title="Create a new Bounty">
    <form onSubmit={handleSubmit(data => console.debug({ data }))}>
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
        {...formControlProps}
      >
        <FormLabel htmlFor="dueat"
          mr="0"
          >
          Due At
          <DatePicker
            selected={dueAt}
            onChange={d => d && setDueAt(d)}
            id="published-date"
            showPopperArrow={true}
          />
        </FormLabel>
      </FormControl>

      <Flex>
        <FormControl
          {...formControlProps}
          isInvalid={!!errors.reward}
          mr="1"
          >
          <FormLabel htmlFor='reward'>Reward</FormLabel>
          <Input id='reward' {...register('reward', {
              required, min: 1
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
        <ExpansionField label="Allow Multiple Claimants?">
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
      </FormControl>

      <FormControl
        bg="rgba(0,0,0,0.2)"
        {...formControlProps}
      >
        <ExpansionField label="Recurring Bounty?">
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
        </FormControl>

        <FormControl
        bg="rgba(0,0,0,0.2)"
        {...formControlProps}
      >
        <ExpansionField label="Restrict Claimants?">
            <FormLabel htmlFor='gated'>
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
              <Select id='gated' {...register('gated', { required })}>
                {currencies.map(c => <option key={c}>{c.toUpperCase()}</option>)}
              </Select>
        </ExpansionField>        
      </FormControl>
      <Button
        mt="5"
        w="full" 
        type="submit">Preview</Button>
    </form>
    </Layout>
  )
}

export default Form;
