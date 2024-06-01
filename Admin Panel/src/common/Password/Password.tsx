import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Applicationlabel from '../en.json';

const Password = (props: any) => {
  return (
    <>
      <span className="password_tips">
        {' '}
       <div className='password-boldletter'>{Applicationlabel.password.passwordvalidation}</div>
        <div className={props.lowerValidated ? 'validated' : 'not-validated'}>
          {props.lowerValidated ? (
            <span className="list-icon green">{<CheckCircleIcon />}</span>
          ) : (
            <span className="list-icon">{<DangerousIcon />}</span>
          )}
          {Applicationlabel.password.lowerValidated}{' '}
        </div>
        <div className={props.upperValidated ? 'validated' : 'not-validated'}>
          {props.upperValidated ? (
            <span className="list-icon green">{<CheckCircleIcon />}</span>
          ) : (
            <span className="list-icon">{<DangerousIcon />}</span>
          )}
          {Applicationlabel.password.upperValidated}{' '}
        </div>
        <div className={props.numberValidated ? 'validated' : 'not-validated'}>
          {props.numberValidated ? (
            <span className="list-icon green">{<CheckCircleIcon />} </span>
          ) : (
            <span className="list-icon"> {<DangerousIcon />} </span>
          )}
          {Applicationlabel.password.numberValidated}
        </div>
        <div className={props.specialValidated ? 'validated' : 'not-validated'}>
          {' '}
          {props.specialValidated ? (
            <span className="list-icon green"> {<CheckCircleIcon />}</span>
          ) : (
            <span className="list-icon"> {<DangerousIcon />}</span>
          )}
          {Applicationlabel.password.specialValidated}
        </div>
        <div className={props.lengthValidated ? 'validated' : 'not-validated'}>
          {' '}
          {props.lengthValidated ? (
            <span className="list-icon green">{<CheckCircleIcon />}</span>
          ) : (
            <span className="list-icon">{<DangerousIcon />}</span>
          )}
          {Applicationlabel.password.lenthValidated}
        </div>
      </span>
    </>
  );
};
export default Password;
