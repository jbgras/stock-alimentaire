import { useMemo, useState } from "react";
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateArticle,
  useGetArticles,
  useUpdateArticles,
  useDeleteArticle,
} from "./data.js";

const Inventory = () => {
  const [editedArticles, setEditedArticles] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => [
    {
      accessorKey: "SKU",
      header: "Référence",
      enableEditing: false,
      size: 80,
    },
    {
      accessorKey: "description",
      header: "Description",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "entryDate",
      header: "Date Entrée",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "date",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "number",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "user",
      header: "Utilisateur",
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
  ]);

  //call CREATE hook
  const { mutateAsync: createArticle, isPending: isCreatingArticle } =
    useCreateArticle();
  //call READ hook
  const {
    data: fetchedArticles = [],
    isError: isLoadingArticlesError,
    isFetching: isFetchingArticles,
    isLoading: isLoadingArticles,
  } = useGetArticles();
  //call UPDATE hook
  const { mutateAsync: updateArticles, isPending: isUpdatingArticles } =
    useUpdateArticles();
  //call DELETE hook
  const { mutateAsync: deleteArticle, isPending: isDeletingArticle } =
    useDeleteArticle();

  //CREATE action
  const handleCreateArticle = async ({ values, table }) => {
    await createArticle(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveArticles = async () => {
    await updateArticles(Object.values(editedArticles));
    setEditedArticles({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row) => {
    if (window.confirm("Etes-vous sûr de supprimer cet article?")) {
      deleteArticle(row.original.SKU);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedArticles,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "table", // ('modal', 'row', 'cell', and 'custom' are also
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.SKU,
    muiToolbarAlertBannerProps: isLoadingArticlesError
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
    onCreatingRowSave: handleCreateArticle,
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
          onClick={handleSaveArticles}
          disabled={Object.keys(editedArticles).length === 0}
        >
          {isUpdatingArticles ? <CircularProgress size={25} /> : "Enregistrer"}
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
      isLoading: isLoadingArticles,
      isSaving: isCreatingArticle || isUpdatingArticles || isDeletingArticle,
      showAlertBanner: isLoadingArticlesError,
      showProgressBars: isFetchingArticles,
    },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const InventoryWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Inventory />
  </QueryClientProvider>
);

export default InventoryWithProviders;
