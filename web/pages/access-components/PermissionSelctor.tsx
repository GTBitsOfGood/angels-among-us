import styles from "./AccessManagementPage.module.css";

export default function PermissionSelector(props) {
  const { admin, setAdmin } = props;
  const styleUnselected = styles.unselectedPermission.toString();
  const styleSelected = styles.selectedPermission.toString();

  return (
    <div className={styles.buttonRow}>
      <div
        id={styles.adminButton}
        className={`${admin ? styleSelected : styleUnselected}`}
        onClick={() => setAdmin(true)}
      >
        Administrator
      </div>
      <div
        id={styles.volunteerButton}
        className={`${admin ? styleUnselected : styleSelected}`}
        onClick={() => setAdmin(false)}
      >
        Volunteer
      </div>
    </div>
  );
}
