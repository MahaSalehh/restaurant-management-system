import { useEffect, useState } from "react";

export function useCrudPage({ getAll, create, update, remove }) {
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
    setShowModal(false);
    fetchData();
  };

  const updateItem = async (id, payload) => {
    await update(id, payload);
    setShowModal(false);
    fetchData();
  };

  const removeItem = async (id) => {
    await remove(id);
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
    createItem,
    updateItem,
    removeItem,
  };
}