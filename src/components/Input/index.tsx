import { MdClose } from "react-icons/md";
import styles from "./page.module.css";

interface InputProps {
  /*
  Placeholder for input
  */
  placeholder: string;
  /*
  Type of input
  */
  type: string;
  /*
  Value of input
  */
  value: string;
  /*
  Function to handle change
  */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /*
  Function to clear input
  */
  onClear: () => void;
  /*
  Icon for input
  */
  icon?: React.ReactNode;
}

export default function Input(props: InputProps) {
  const { placeholder, type, value, onChange, icon, onClear } = props;

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon && icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      />
      <MdClose
        title="Limpar pesquisa"
        className={styles.close}
        onClick={onClear}
      />
    </div>
  );
}
