// /src/api/desigService.js
import api from "./axios";

export const designationService = {
  getDesignations: async (deptId, page = 1, pageSize = 20) => {
    const response = await api.get(`/dept/design/${deptId}/list/`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  createDesignation: async (deptId, data) => {
    const response = await api.post(`/dept/design/${deptId}/create/`, data);
    return response.data;
  },

  updateDesignation: async (deptId, id, data) => {
    const response = await api.patch(
      `/dept/design/${deptId}/${id}/update/`,
      data,
    );
    return response.data;
  },

  deleteDesignation: async (deptId, id) => {
    const response = await api.delete(`/dept/design/${deptId}/${id}/delete/`);
    return response.data;
  },
};
