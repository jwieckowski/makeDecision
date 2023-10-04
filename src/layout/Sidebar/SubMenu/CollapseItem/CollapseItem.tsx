import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

// TYPES
import { AllMethodsItem } from '@/types';

export type CollapseItemProps = {
  open: boolean;
  forceOpen: boolean;
  methods: AllMethodsItem;
  onClick: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    type: string,
    typeLabel: string,
    method: string,
    label: string,
    inputConnections: [] | string[],
    outputConnections: [] | string[],
  ) => void;
};

export default function CollapseItem({ open, forceOpen, methods, onClick }: CollapseItemProps) {
  return (
    <Collapse in={open || forceOpen} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {methods.data.map((method) => {
          return (
            <Box key={method.name}>
              <ListItem
                onClick={(e) => {
                  onClick(
                    e,
                    methods.key,
                    methods.label,
                    method.name,
                    method.label,
                    methods.inputConnections,
                    methods.outputConnections,
                  );
                }}
                disablePadding
                secondaryAction={
                  methods.key === 'Weights' || methods.key === 'Method' ? (
                    <Box>
                      <Typography variant="caption" sx={{ fontSize: 8, verticalAlign: 'top' }}>
                        {method.extensions.map((item) => item.toUpperCase()).join(', ')}
                      </Typography>
                    </Box>
                  ) : null
                }
              >
                <ListItemButton sx={{ pl: 2 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                        {method.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ backgroundColor: '#6a6a6a' }} />
            </Box>
          );
        })}
      </List>
    </Collapse>
  );
}
