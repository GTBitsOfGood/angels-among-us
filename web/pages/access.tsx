import { use, useEffect, useState } from "react";
import CreateAccountForm from "./access-components/CreateAccountForm";
import AccountTable from "./access-components/AccountTable";
import styles from "./access-components/AccessManagementPage.module.css";

export default function Access() {
  const [accountList, updateAccountList] = useState([
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
    {
      email: "TESTEMAIL@EMAIL>COM",
      admin: true,
    },
  ]);

  return (
    <div id={styles.accessPage}>
      <h1 className={styles.header1}>Accounts List</h1>
      <CreateAccountForm
        accountList={accountList}
        updateAccountList={updateAccountList}
      ></CreateAccountForm>
      <AccountTable
        accountList={accountList}
        updateAccountList={updateAccountList}
      ></AccountTable>
    </div>
  );
}
