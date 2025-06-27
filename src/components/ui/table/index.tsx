import { ReactNode } from "react";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/*  Table (root)                                                              */
/* -------------------------------------------------------------------------- */
// Props for Table

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}
// Props for TableHeader

const Table: React.FC<TableProps> = ({ children, className, ...rest }) => (
  <table className={clsx("min-w-full", className)} {...rest}>
    {children}
  </table>
);

/* -------------------------------------------------------------------------- */
/*  Section wrappers <thead> / <tbody>                                        */
/* -------------------------------------------------------------------------- */
export interface TableSectionProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

// Props for TableHeader

const TableHeader: React.FC<TableSectionProps> = ({
  children,
  className,
  ...rest
}) => (
  <thead className={className} {...rest}>
    {children}
  </thead>
);

// Props for TableBody

const TableBody: React.FC<TableSectionProps> = ({
  children,
  className,
  ...rest
}) => (
  <tbody className={className} {...rest}>
    {children}
  </tbody>
);

/* -------------------------------------------------------------------------- */
/*  Row wrapper <tr>                                                          */
/* -------------------------------------------------------------------------- */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}
// Props for TableRow

const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  ...rest
}) => (
  <tr className={className} {...rest}>
    {children}
  </tr>
);

/* -------------------------------------------------------------------------- */
/*  Cell component <td>/<th>                                                  */
/* -------------------------------------------------------------------------- */
export interface TableCellProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    React.TdHTMLAttributes<HTMLTableCellElement> {
  isHeader?: boolean;
  children: ReactNode;
}

// Props for TableCell

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  ...rest
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={clsx(className)} {...rest}>
      {children}
    </CellTag>
  );
};

/* -------------------------------------------------------------------------- */
/*  Exports                                                                   */
/* -------------------------------------------------------------------------- */
export { Table, TableHeader, TableBody, TableRow, TableCell }; 


// import { ReactNode } from "react";

// // Props for Table
// interface TableProps {
//   children: ReactNode; // Table content (thead, tbody, etc.)
//   className?: string; // Optional className for styling
// }

// // Props for TableHeader
// interface TableHeaderProps {
//   children: ReactNode; // Header row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableBody
// interface TableBodyProps {
//   children: ReactNode; // Body row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableRow
// interface TableRowProps {
//   children: ReactNode; // Cells (th or td)
//   className?: string; // Optional className for styling
// }

// // Props for TableCell
// interface TableCellProps {
//   children: ReactNode; // Cell content
//   isHeader?: boolean; // If true, renders as <th>, otherwise <td>
//   className?: string; // Optional className for styling
// }

// // Table Component
// const Table: React.FC<TableProps> = ({ children, className }) => {
//   return <table className={`min-w-full  ${className}`}>{children}</table>;
// };

// // TableHeader Component
// const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
//   return <thead className={className}>{children}</thead>;
// };

// // TableBody Component
// const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
//   return <tbody className={className}>{children}</tbody>;
// };

// // TableRow Component
// const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
//   return <tr className={className}>{children}</tr>;
// };

// // TableCell Component
// const TableCell: React.FC<TableCellProps> = ({
//   children,
//   isHeader = false,
//   className,
// }) => {
//   const CellTag = isHeader ? "th" : "td";
//   return <CellTag className={` ${className}`}>{children}</CellTag>;
// };

// export { Table, TableHeader, TableBody, TableRow, TableCell };
