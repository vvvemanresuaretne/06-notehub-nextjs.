import { useField } from 'formik';
import styles from './ErrorMessage.module.css';
import React from 'react';

interface ErrorMessageProps {
  name?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ErrorMessage({
  name = '__unused__',
  className,
  children,
}: ErrorMessageProps) {
  const [, meta] = useField(name);

  if (children) {
    return <p className={className || styles.text}>{children}</p>;
  }

  if (!meta.touched || !meta.error) {
    return null;
  }

  return <p className={className || styles.text}>{meta.error}</p>;
}