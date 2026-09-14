import React from 'react'
import styles from './Card.module.css'

export interface CardProps {
  title?: string
  subtitle?: string
  headerAction?: React.ReactNode
  footer?: React.ReactNode
  hoverable?: boolean
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  hoverable = false,
  children,
  className = '',
}) => {
  const cardClassName = [
    styles.card,
    hoverable ? styles.hoverable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassName}>
      {(title || headerAction) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}
