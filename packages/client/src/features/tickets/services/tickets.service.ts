import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import type { Ticket } from '@gmss/types';

export const GET_TICKETS = gql`
  query GetTickets($assignedTo: String, $status: String) {
    getTickets(assignedTo: $assignedTo, status: $status) {
      id
      title
      description
      priority
      status
      assignedTo
      assignedBy
      referenceId
      referenceType
      createdDate
      updatedDate
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket(
    $title: String!
    $description: String
    $priority: TicketPriority!
    $assignedTo: String
    $referenceId: String
    $referenceType: String
  ) {
    createTicket(
      title: $title
      description: $description
      priority: $priority
      assignedTo: $assignedTo
      referenceId: $referenceId
      referenceType: $referenceType
    ) {
      id
      title
      priority
      status
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($id: ID!, $input: UpdateTicketInput!) {
    updateTicket(id: $id, input: $input) {
      id
      title
      description
      priority
      status
      assignedTo
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation DeleteTicket($id: ID!) {
    deleteTicket(id: $id)
  }
`;

export function useTickets(assignedTo?: string, status?: string) {
  const { data, loading, refetch } = useQuery<{ getTickets: Ticket[] }>(
    GET_TICKETS,
    { variables: { assignedTo, status } },
  );

  const [createTicket, { loading: creating }] = useMutation(CREATE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS, variables: { assignedTo, status } }],
  });

  const [updateTicket, { loading: updating }] = useMutation(UPDATE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS, variables: { assignedTo, status } }],
  });

  const [deleteTicket, { loading: deleting }] = useMutation(DELETE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS, variables: { assignedTo, status } }],
  });

  return {
    tickets: data?.getTickets ?? [],
    loading,
    creating,
    updating,
    deleting,
    refetch,
    createTicket: (vars: Record<string, unknown>) =>
      createTicket({ variables: vars }),
    updateTicket: (id: string, input: Record<string, unknown>) =>
      updateTicket({ variables: { id, input } }),
    deleteTicket: (id: string) => deleteTicket({ variables: { id } }),
  };
}
