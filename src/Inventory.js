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
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  useCreateArticle,
  useGetArticles,
  useUpdateArticles,
  useDeleteArticle,
} from "./data.js";
import { mkConfig, generateCsv, download } from "export-to-csv";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const Inventory = () => {
  const [editedArticles, setEditedArticles] = useState({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => [
    {
      accessorKey: "TypeDeProduit",
      header: "Type de produit",
      size: 200,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        multiline: true,
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "CodeUPC_QR",
      header: "Code UPC/QR",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        multiline: true,
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Location",
      header: "Location",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Boite",
      header: "Boîte #",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Format",
      header: "Format",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Quantite",
      header: "Quantité",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Expiration_BB",
      header: "Expiration/BB",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "date",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Valeur",
      header: "Valeur",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "ValeurTotale",
      header: "Valeur totale",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Categorie",
      header: "Catégorie",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "Statut",
      header: "Statut",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "text",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "RecuLe",
      header: "Reçu le",
      size: 50,
      muiEditTextFieldProps: ({ cell, row }) => ({
        type: "date",
        onBlur: (event) => {
          setEditedArticles({ ...editedArticles, [row.SKU]: row.original });
        },
      }),
    },
    {
      accessorKey: "De",
      header: "De",
      size: 50,
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
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Créer un nouvel article
        </Button>
        <Button
          onClick={() => handleExportData(fetchedArticles)}
          startIcon={<FileDownloadIcon />}
        >
          Export excel
        </Button>{" "}
      </Box>
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

const handleExportData = (data) => {
  const csv = generateCsv(csvConfig)(data);
  download(csvConfig)(csv);
};

const queryClient = new QueryClient();

const InventoryWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Inventory />
  </QueryClientProvider>
);

export default InventoryWithProviders;
