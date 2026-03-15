"use client";

import styles from "./CustomButton.module.css";

type CustomButtonProps = {
  text: string;
  onClick?: () => void;
};

export function CustomButton({ text, onClick }: CustomButtonProps) {
  return (
    <div className={styles.customButtonWrapper}>
      <button className={styles.customButton} type="button" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}

