import { useTable, usePagination } from "react-table";
import AccountManagementButtons from "./AccountActionButtons";
import styles from "./AccessManagementPage.module.css";
import { useEffect } from "react";

function Table({ columns, data }) {
  const {
    page,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div className={styles.tableDiv}>
      <table className={styles.table} {...getTableProps()}>
        <thead className={styles.tableHead}>
          {headerGroups.map((headerGroup) => (
            <tr
              className={styles.td}
              {...headerGroup.getHeaderGroupProps()}
              key="0"
            >
              {headerGroup.headers.map((column) => (
                <th
                  className={styles.th}
                  {...column.getHeaderProps()}
                  key={column.id}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={styles.tableBody} {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                className={styles.tableRow}
                {...row.getRowProps()}
                key={page.indexOf(row)}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={styles.td}
                      {...cell.getCellProps()}
                      key={row.cells.indexOf(cell)}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AccountTable(props) {
  const { accountList } = props;

  const columns = [
    {
      id: "email",
      Header: "Email Address",
      accessor: "email",
    },
    {
      id: "admin",
      Header: "Role",
      accessor: (r) => {
        return r.admin ? "Administrator" : "Volunteer";
      },
    },
    {
      id: "access",
      Header: "Access",
      accessor: (r) => {
        return r.admin ? "Yes" : "No";
      },
    },
    {
      id: "action",
      Header: "Actions",
      accessor: () => {
        return <AccountManagementButtons></AccountManagementButtons>;
      },
    },
  ];

  return <Table data={accountList} columns={columns} />;
}

export default AccountTable;
