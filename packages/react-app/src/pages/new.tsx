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

const currencies = [
  'bank', 'eth', 'city'
]

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
    defaultValues: {
      title: 'Create a logo for the bountyboard',
      description: 'We need a sharp and stylish logo in the next couple of weeks',
      reward: 1000,
      currency: 'BANK',
      criteria: 'PNG and SVG images submitted and approved by the team',
      dueAt: new Date(),
    } 
  })
  return (
    <Layout title="Create a new Bounty">
    <form onSubmit={() => handleSubmit(data => console.debug({ data }))}>
      <FormControl
        {...formControlProps}
        >
        <FormLabel htmlFor='title'>Bounty Title</FormLabel>
        <Input id='title' type='text' placeholder="Catchy Name"/>
      </FormControl>

      <FormControl
        {...formControlProps}
        >
        <FormLabel htmlFor='description'>Description</FormLabel>
        <Box
          bg="rgba(0,0,0,0.2)"
          p="4"
          my="2"
        >Provide a brief description of the bounty</Box>
        <Input id='description' type='text' placeholder="Brief Description"/>
      </FormControl>
      
      <FormControl
        {...formControlProps}
        >
        <FormLabel htmlFor='criteria'>Criteria</FormLabel>
        <Input id='criteria' type='text' placeholder="Absolute Requirements" />
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

      <FormControl
        {...formControlProps}
        >
        <FormLabel htmlFor='criteria'>Reward</FormLabel>
        <Flex>
        <Input id='reward' type='number' placeholder="0" mr="3"/>
        <Select id='currency' placeholder='BANK'>
          {currencies.map(c => <option key={c}>{c.toUpperCase()}</option>)}
        </Select>
        </Flex>
      </FormControl>

      <FormControl
        bg="black"
        {...formControlProps}
      >
        <ExpansionField label="Allow Multiple Claimants?">
          <FormControl>
            <Flex mb="3">
            <InfoIcon mr="3" mt="1"/>
                <Text
                  p="0"
                  m="0"
                  fontSize="12"
                  fontStyle="italic"
                >
                 Multiple People will be able to claim the bounty
            </Text>
            </Flex>            
            <FormLabel htmlFor='maxClaim'>Max Claimants</FormLabel>
            <Input id='maxClaim' type='number' placeholder="2" />
          </FormControl>
        </ExpansionField>
      </FormControl>

      <FormControl
        bg="black"
        {...formControlProps}
      >
        <ExpansionField label="Recurring Bounty?">
          <FormControl>
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
          </FormControl>
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
