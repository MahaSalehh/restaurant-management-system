import { adminAPI } from "../service/api";

export const ACTIONS = {

  view: (setState, item) => ({
    label: "View",
    variant: "primary",
    onClick: () => setState({ mode: "view", item }),
  }),

  edit: (setState, item, openEdit) => ({
    label: "Edit",
    variant: "warning",
    onClick: () => {
      openEdit(item);
      setState({ mode: "edit", item });
    },
  }),

  delete: (removeFn, id) => ({
    label: "Delete",
    variant: "danger",
    onClick: () => removeFn(id),
  }),

  restore: (fn, id) => ({
    label: "Restore",
    variant: "success",
    onClick: () => fn(id),
  }),

};