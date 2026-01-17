

const verifyEmailTemplate = ({name,phone,plainPassword}) => {
    return(
        `<p>Dear ${name}</p>
    <p>Thank you for registering Smart Rent</p>
    <a href="" style="color:black;background:orange;margin-top:10px;padding:20px;display:block">
    Your credentials are phone:${phone} and Password: ${plainPassword}
    </a>
    <p>Store them safely<p>
    `
        
    )
  
}

export default verifyEmailTemplate