import React, { useMemo } from "react";
import { useTable } from "react-table";

export default function AccountTable(props) {
  const { accountList } = props;

  const data = React.useMemo(
    () => [
      {
        email: "Test1",
        admin: "Admin",
      },
      {
        email: "Test2",
        admin: "Volunteer",
      },
      {
        email: "Test3",
        admin: "Admin",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: "Email Address",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "admin",
      },
      {
        Header: "Access",
        accessor: "access",
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
