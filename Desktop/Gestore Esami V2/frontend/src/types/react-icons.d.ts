declare module 'react-icons/md' {
  import { ComponentType } from 'react';
  
  interface IconProps {
    size?: number | string;
    color?: string;
    className?: string;
  }
  
  export const MdAdd: ComponentType<IconProps>;
  export const MdDelete: ComponentType<IconProps>;
  export const MdDragIndicator: ComponentType<IconProps>;
  export const MdChecklistRtl: ComponentType<IconProps>;
  export const MdClose: ComponentType<IconProps>;
  export const MdCheck: ComponentType<IconProps>;
  export const MdPrint: ComponentType<IconProps>;
}