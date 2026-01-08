import styles from '../../app/dashboard/dashboard.module.css';

export default function LiveExamSkeleton() {
  return (
    <div className={styles.examGrid}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className={styles.examCard}>
          <div className={styles.skeletonBadge}></div>

          <div className={styles.skeletonTitle}></div>

          <div className={styles.skeletonDetail}></div>
          <div className={styles.skeletonDetail}></div>

          <div className={styles.skeletonButton}></div>
        </div>
      ))}
    </div>
  );
}
