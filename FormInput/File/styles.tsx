import createStyles from '@material-ui/core/styles/createStyles';

export const styles = createStyles({
  image: {
    width: 220,
    height: 125,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    OUserSelect: 'none',
    userSelect: 'none',
    WebkitUserDrag: 'none',
  },
  progress: {
    width: '100%',
    position: 'absolute',
    background: '#ffffff80',
    zIndex: 9,
    height: '100%',
    overflow: 'hidden',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
});
