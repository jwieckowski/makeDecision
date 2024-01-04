import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type TableProps = {
  data: (number | string)[][];
  headers: string[];
  labels: string[];
  title?: string;
  precision?: number;
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomTable({ data, headers, labels, title, precision }: TableProps) {
  return (
    <Container maxWidth="lg" sx={{ overflow: 'auto' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="results-table">
          <TableHead>
            <TableRow>
              <StyledTableCell>{title ? title.toUpperCase() : null}</StyledTableCell>
              {Array.from({ length: data[0]?.length ? data[0].length : 0 }).map((_, index) => {
                return (
                  <StyledTableCell key={index}>
                    {headers[index].includes('|') ? (
                      headers[index].split(' | ').map((item, idx) => {
                        return (
                          <Typography
                            key={item}
                            sx={{
                              fontSize: idx === 0 ? 14 : 10,
                            }}
                          >
                            {item}
                          </Typography>
                        );
                      })
                    ) : (
                      <Typography>{headers[index]}</Typography>
                    )}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, colIdx) => {
              return (
                <StyledTableRow key={colIdx}>
                  <TableCell>
                    {labels[colIdx].split(' | ').map((item, idx) => {
                      return (
                        <Typography key={item} style={{ fontSize: idx === 0 ? 14 : 10 }}>
                          {item}
                        </Typography>
                      );
                    })}
                  </TableCell>
                  {Array.from({ length: row?.length ? row.length : 0 }).map((_, rowIdx) => (
                    <TableCell key={rowIdx}>
                      <Typography>
                        {precision ? parseFloat(`${data[colIdx][rowIdx]}`).toFixed(precision) : data[colIdx][rowIdx]}
                      </Typography>
                    </TableCell>
                  ))}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
