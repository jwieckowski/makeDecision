import { Link } from "react-router-dom";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactPageIcon from '@mui/icons-material/ContactPage';

export default function MenuList() {

  const icons = [
    <HomeIcon />,
    <CalculateIcon />,
    <DeveloperBoardIcon />,
    <DescriptionIcon />,
    <ContactPageIcon />
  ]

  const urls = [
    '/home',
    '/calculation',
    '/technologies',
    '/about',
    '/contact'
  ]

    return (
      <>
        <List>
          {['Home', 'Calculation', 'Technologies', 'About', 'Contact'].map((text, index) => (
            <Link to={urls[index]} style={{color: 'inherit', textDecoration: 'none'}}>
              <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {icons[index]}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </>
    )
}