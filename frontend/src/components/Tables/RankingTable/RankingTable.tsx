import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { ResultsMethodRankings } from '../../../redux/types';
import { Typography } from '@mui/material';


type RankingTableParams = {
  results: ResultsMethodRankings[],
  idx: number
}

export default function RankingTable({results, idx}: RankingTableParams) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Methods ranking table">
        <TableHead>
          <TableRow>
            <TableCell>
                <Typography variant='body1' textAlign='center'>
                    RANKING
                </Typography>
                <Typography variant='body2' textAlign='center'>
                    MATRIX {idx+1}
                </Typography>
            </TableCell>
            {results[0].ranking.map((_, idx) => {
                return (
                    <TableCell>
                        <Typography variant='body1' textAlign='center'>
                            A{idx+1}
                        </Typography>
                    </TableCell>
                )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((res, index) => {
            return (
                <TableRow key={index}>
                    <TableCell>
                        <Typography variant='body1' textAlign='center'>
                            {res.methods.method.toUpperCase()}
                        </Typography>
                        <Typography variant='body2' textAlign='center'>
                            {res.methods.weights.toUpperCase()}
                        </Typography>
                    </TableCell>
                    {res.ranking.map(r => {
                        return (
                            <TableCell>
                                <Typography variant='body2' textAlign='center'>
                                    {r}
                                </Typography>
                            </TableCell>
                        )
                    })}
                </TableRow>
            )
            }
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}