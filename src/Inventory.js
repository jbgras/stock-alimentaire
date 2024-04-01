import { useMemo, useState, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fakeData } from './data';
import DeleteIcon from '@mui/icons-material/Delete';

const Inventory = () => {
  const [articles, setArticles] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});   //keep track of rows that have been edited
  useEffect(() => {
    const getArticles = async () => {
      // const articlesCol = collection(db, 'articles');
      // const articlesSnapshot = await getDocs(articlesCol);
      // const articlesList = articlesSnapshot.docs.map(doc => doc.data());
      const articlesList = [{ 'UMC': '12345' }];
      setArticles(articlesList);
    }
    getArticles();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'UMC',
        header: 'UMC',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          onBlur: (event) => {
            setEditedUsers({ ...editedUsers, [row.UMC]: row.original });
          },
        }),
      },
      {
        accessorKey: 'entryDate',
        header: 'Date Entrée',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'date',
          onBlur: (event) => {
            setEditedUsers({ ...editedUsers, [row.UMC]: row.original });
          },
        }),
      },
      {
        accessorKey: 'bestBefore',
        header: 'Meilleur avant',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'date',
          onBlur: (event) => {
            setEditedUsers({ ...editedUsers, [row.UMC]: row.original });
          },
        }),
      },
      {
        accessorKey: 'user',
        header: 'Utilisateur',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          onBlur: (event) => {
            setEditedUsers({ ...editedUsers, [row.UMC]: row.original });
          },
        }),
      },
    ],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    useUpdateUsers();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser = async ({ values, table }) => {
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUsers = async () => {
    await updateUsers(Object.values(editedUsers));
    setEditedUsers({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(row.original.UMC);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.UMC,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
        color: 'error',
        children: 'Erreur chargement des données',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowSave: handleCreateUser,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveUsers}
          disabled={
            Object.keys(editedUsers).length === 0
          }
        >
          {isUpdatingUsers ? <CircularProgress size={25} /> : 'Enregistrer'}
        </Button>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Créer un nouvel article
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
          id: (Math.random() + 1).toString(36).substring(7),
        },
      ]);
    },
  });
}

//READ hook (get users from api)
function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUsers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (users) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUsers) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.map((user) => {
          const newUser = newUsers.find((u) => u.UMC === user.UMC);
          return newUser ? newUser : user;
        }),
      );
    },
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId) => {
      queryClient.setQueryData(['users'], (prevUsers) =>
        prevUsers?.filter((user) => user.UMC !== userId),
      );
    },
  });
}

const queryClient = new QueryClient();

const InventoryWithProviders = () =>
  (
    //Put this with your other react-query providers near root of your app
    <QueryClientProvider client={queryClient}>
        <Inventory />
    </QueryClientProvider>
  );

export default InventoryWithProviders;
