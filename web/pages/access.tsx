import CreateAccountForm from "../components/CreateAccountForm";
import AccountTable from "../components/AccountTable";
import styles from "../components/AccessManagementPage.module.css";
import { useState } from "react";

export default function Access() {
  const [accountList, updateAccountList] = useState<Object[] | null>([]);

  return (
    <div id={styles.background}>
      <div id={styles.accessPage}>
        <h1 className={styles.header1}>Accounts List</h1>
        <CreateAccountForm
          accountList={accountList}
          updateAccountList={updateAccountList}
        ></CreateAccountForm>
        <AccountTable accountList={accountList}></AccountTable>
      </div>
    </div>
  );
}
