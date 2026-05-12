import { DeleteIcon } from "../../icons";
import { useEffect } from "react";
import { useDeleteTamizaje } from "../../hooks/tamizaje/useDeleteTamizaje";
import Loader from "../Loader";

export const DeleteBtn = ({ refetch, clearChecks, disabled, info }) => {
  const {deleteTamizaje, data, loading, error } = useDeleteTamizaje();

  useEffect(() => {
    if (error) {
      console.error("error", error);
    }
  }, [error]);

  useEffect(() => {
    if (!data) return;
    console.error("Tamizaje eliminado correctamente");
    refetch();
    clearChecks();
  }, [data]);
  return (
    <button variant="danger" disabled={disabled || loading} 
      onClick={() => {
        if (!info.incomeId) return;
        deleteTamizaje({
          incomeId: info.incomeId,
        });
      }} 
      className={`inline-flex items-center justify-center rounded px-3 py-2 text-white text-sm font-medium
        ${disabled || loading
          ? "bg-red-300 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        }`}
    >
      {loading ? (
        <Loader />
      ) : (
        <DeleteIcon width={20} height={20} />
      )}
    </button>
  );
};
