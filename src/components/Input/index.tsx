import styles from "./page.module.css";

interface InputProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function Input(props: InputProps) {
  const { placeholder, type, value, onChange, icon } = props;

  return (
    <div className={styles.container}>
      {icon && icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
