import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react'

const Form = ({ bountyForm }: { bountyForm: any }): JSX.Element => {
  const router = useRouter()
  const contentType = 'application/json'

  const schema = yup.object().shape({
    title: yup
      .string()
      .required('Please provide a title for this Bounty.')
      .max(80, 'Title cannot be more than 80 characters'),
    description: yup
      .string()
      .required('Please provide the bounty description')
      .max(140, 'Description cannot be more than 140 characters'),
    criteria: yup
      .string()
      .required('Please provide the bounty criteria')
      .max(140, 'Criteria cannot be more than 140 characters'),
    rewardAmount: yup
      .number()
      .typeError('Invalid number')
      .positive()
      .integer()
      .required('Please provide the bounty reward amount'),
    rewardCurrency: yup
      .string()
      .required('Please provide the bounty reward currency')
      .max(60, 'Currency cannot be more than 60 characters'),
  })

  const defaults = {
    ...bountyForm,
    rewardAmount: bountyForm.reward.amount,
    rewardCurrency: bountyForm.reward.currency,
  }
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaults,
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    reset(defaults)
  }, [reset])

  const putData = async (values: any) => {
    // const output = {
    //   ...values,
    //   reward: { amount: values.rewardAmount, currency: values.rewardCurrency },
    // }

    /// FOR TESTING PURPOSES ONLY, OVERRIDE VALUES SET
    //////////////////////////////////////////////////
    console.error(values)

    /// Change this to troubleshoot, removing the reward field entirely makes it successful
    const output = {
      title: 'testing',
      description: 'big bounty',
      criteria: 'none',
      season: 1,
      reward: { amount: 100000, currency: 'BANK' },
      createdBy: {
        discordHandle: 'Tiki#0503',
        discordId: '749152252966469668',
      },
      createdAt: '2021-08-04T13:07:50.097Z',
      statusHistory: [
        { status: 'Draft', setAt: '2021-08-04T13:07:50.097Z' },
        { status: 'Open', setAt: '2021-08-04T13:08:23.220Z' },
      ],
      status: 'Draft',
      dueAt: '2021-10-01T00:00:00.000Z',
      discordMessageId: '872465988522745906',
    }

    const { id } = router.query
    try {
      const res = await fetch(`/api/bounties/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(output),
      })

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`)
      }

      const { data } = await res.json()
      mutate(`/api/bounties/${id}`, data, false)
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }
  function onSubmit(values: JSON) {
    return new Promise<void>((resolve) => {
      putData(values)
      resolve()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.title}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input id="title" placeholder="title" {...register('title')} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.description}>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input
          id="description"
          placeholder="description"
          {...register('description')}
        />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.criteria}>
        <FormLabel htmlFor="criteria">Criteria</FormLabel>
        <Input id="criteria" placeholder="criteria" {...register('criteria')} />
        <FormErrorMessage>{errors.criteria?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.rewardAmount}>
        <FormLabel htmlFor="rewardAmount">Reward Amount</FormLabel>
        <Input
          id="rewardAmount"
          placeholder="amount"
          {...register('rewardAmount')}
        />
        <FormErrorMessage>{errors.rewardAmount?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={errors.rewardCurrency}>
        <FormLabel htmlFor="rewardCurrency">Reward Currency</FormLabel>
        <Input
          id="rewardCurrency"
          placeholder="currency"
          {...register('rewardCurrency')}
        />
        <FormErrorMessage>{errors.rewardCurrency?.message}</FormErrorMessage>
      </FormControl>

      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}

export default Form
