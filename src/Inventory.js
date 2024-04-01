import { useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./data.js";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";

const Inventory = () => {
  const [editedUsers, setEditedUsers] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => [
    {
      accessorKey: "GTIN",
      header: "GTIN",
      enableEditing: false,
      size: 80,
    },
    {
      accessorKey: "description",
      header: "Description",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedUsers({ ...editedUsers, [row.GTIN]: row.original });
        },
      }),
    },
    {
      accessorKey: "entryDate",
      header: "Date Entrée",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "date",
        onBlur: (event) => {
          setEditedUsers({ ...editedUsers, [row.GTIN]: row.original });
        },
      }),
    },
    {
      accessorKey: "bestBefore",
      header: "Meilleur avant",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "date",
        onBlur: (event) => {
          setEditedUsers({ ...editedUsers, [row.GTIN]: row.original });
        },
      }),
    },
    {
      accessorKey: "user",
      header: "Utilisateur",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedUsers({ ...editedUsers, [row.GTIN]: row.original });
        },
      }),
    },
  ]);

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
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(row.original.GTIN);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.GTIN,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: "error",
          children: "Erreur chargement des données",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowSave: handleCreateUser,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveUsers}
          disabled={Object.keys(editedUsers).length === 0}
        >
          {isUpdatingUsers ? <CircularProgress size={25} /> : "Enregistrer"}
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
      queryClient.setQueryData(["users"], (prevUsers) => [
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
    queryKey: ["users"],
    queryFn: async () => {
      const inventoryCol = collection(db, "articles");
      const inventorySnapshot = await getDocs(inventoryCol);
      let inventoryList = inventorySnapshot.docs.map((doc) => doc.data());
      console.log("inventory\n" + JSON.stringify(inventoryList) + "\n");
      return Promise.resolve(inventoryList);
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
      queryClient.setQueryData(["users"], (prevUsers) =>
        prevUsers?.map((user) => {
          const newUser = newUsers.find((u) => u.GTIN === user.GTIN);
          return newUser ? newUser : user;
        })
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
      queryClient.setQueryData(["users"], (prevUsers) =>
        prevUsers?.filter((user) => user.GTIN !== userId)
      );
    },
  });
}

const queryClient = new QueryClient();

const InventoryWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Inventory />
  </QueryClientProvider>
);

export default InventoryWithProviders;
