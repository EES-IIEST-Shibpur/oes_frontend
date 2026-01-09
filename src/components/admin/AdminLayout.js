'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import styles from './AdminLayout.module.css';

export function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', },
    { label: 'Manage Questions', href: '/admin/questions', },
    { label: 'Manage Exams', href: '/admin/exams', },
  ];

  const getInitials = () => {
    if (admin?.data?.email) {
      return admin.data.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
          <p>OES Management</p>
        </div>

        <nav>
          <ul className={styles.navMenu}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href} className={styles.navItem}>
                  <a
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{getInitials()}</div>
            <div className={styles.userDetails}>
              <h4>Admin</h4>
              <p>{admin?.data?.email || 'admin@oes.com'}</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
