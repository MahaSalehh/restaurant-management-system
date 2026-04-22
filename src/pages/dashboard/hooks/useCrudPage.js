import { useEffect, useState } from "react";

export function useCrudPage({ getAll, create, update, delete: deleteApi }) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAll();
      setData(res.data.data || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setFormData({});
    setShowModal(true);
  };

  const openEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const createItem = async (payload) => {
    await create(payload);
    fetchData();
  };

  const updateItem = async (id, payload) => {
    await update(id, payload);
    fetchData();
  };

  const remove = async (id) => {
    await deleteApi(id);
    fetchData();
  };

  return {
    data,
    loading,
    formData,
    setFormData,
    showModal,
    setShowModal,
    openCreate,
    openEdit,
    create: createItem,
    update: updateItem,
    remove,
  };
}