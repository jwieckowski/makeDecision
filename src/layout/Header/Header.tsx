import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// CONST
import {TITLE} from '@/common/const'

// STYLE
import './Header.css'

type HeaderProps = {
    onMenuClick: () => void
}

export default function Header({onMenuClick} : HeaderProps) {
  return (
    <Toolbar>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2, display: { sm: 'none' } }}
        >
            <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
            {TITLE}
        </Typography>
    </Toolbar>
  )
}
