import { useTable, TableInstance, UsePaginationState } from "react-table";
import AccountManagementButtons from "./AccountActionButtons";
import styles from "./AccessManagementPage.module.css";

export type TableInstanceWithHooks<T extends object> = TableInstance<T> & {
  state: UsePaginationState<T>;
};

const Table = ({ columns, data }: { columns: any; data: any }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

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
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                className={styles.tableRow}
                {...row.getRowProps()}
                key={rows.indexOf(row)}
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
};

function AccountTable(props: any) {
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
      accessor: (r: any) => {
        return r.admin ? "Administrator" : "Volunteer";
      },
    },
    {
      id: "access",
      Header: "Access",
      accessor: (r: any) => {
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
