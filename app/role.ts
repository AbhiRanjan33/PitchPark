// role.ts (optional)
export const setRoleInStorage = (role: string): void => {
    sessionStorage.setItem("selectedRole", role);
  };
  
  export const getRoleFromStorage = (): string | null => {
    return sessionStorage.getItem("selectedRole");
  };