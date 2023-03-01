import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { ResultsMethod } from '../../../redux/types';
import { Typography } from '@mui/material';


type PreferenceTableParams = {
  results: ResultsMethod[],
  idx: number
}

export default function PreferenceTable({results, idx}: PreferenceTableParams) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="Methods preferences table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='body1' textAlign='center'>
                PREFERENCES
              </Typography>
              <Typography variant='body2' textAlign='center'>
                MATRIX {idx+1}
              </Typography>
            </TableCell>
            {results[0].preference.map((_, idx) => {
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
                    {res.method.toUpperCase()}
                  </Typography>
                  <Typography variant='body2' textAlign='center'>
                    {res.weights.toUpperCase()}
                  </Typography>
                </TableCell>
                {res.preference.map(r => {
                  return (
                    <TableCell>
                      <Typography variant='body2' textAlign='center'>
                        {r.toFixed(4)}
                      </Typography>
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}