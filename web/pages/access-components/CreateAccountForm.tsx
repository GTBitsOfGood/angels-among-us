import { z } from "zod";
import { useState } from "react";
import PermissionSelector from "./PermissionSelctor";
import styles from "./AccessManagementPage.module.css";

export default function CreateAccountForm(props) {
  const { accountList, updateAccountList } = props;
  const [emailField, setEmailField] = useState("");
  const [admin, setAdmin] = useState(true);
  const [displayError, setDisplayError] = useState(false);

  function handleChange(event) {
    setEmailField(event.target.value);
  }

  function validateEmail(emailField): boolean {
    const emailSchema = z.string().email();
    const result = emailSchema.safeParse(emailField);
    return result.success;
  }

  function ErrorMessage() {
    if (displayError) {
      return <p>Invalid Email Address</p>;
    } else {
      return <></>;
    }
  }

  function updateState() {
    const isValid = validateEmail(emailField);
    if (isValid) {
      setDisplayError(false);
      const temp = [...accountList];
      temp.push({
        email: emailField,
        admin: admin,
      });
      updateAccountList(temp);
      setEmailField("");
      setAdmin(true);
    } else {
      setDisplayError(true);
    }
  }

  return (
    <div id={styles.formSection}>
      <h2>Add New Account</h2>
      <form>
        <input
          type="text"
          placeholder="Email"
          value={emailField}
          onChange={handleChange}
        ></input>
      </form>
      <p>Permissions</p>
      <PermissionSelector
        admin={admin}
        setAdmin={setAdmin}
      ></PermissionSelector>
      <div id={styles.createAccountRow}>
        <ErrorMessage></ErrorMessage>
        <div onClick={updateState} id={styles.addAccountButton}>
          Add Account
        </div>
      </div>
    </div>
  );
}
