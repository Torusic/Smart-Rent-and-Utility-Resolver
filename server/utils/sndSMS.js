import twilio from 'twilio'

const accountSid=process.env.TWILIO_ACCOUNT_SID
const authToken=process.env.TWILIO_AUTH_TOKEN
const twilioPhone=process.env.TWILIO_PHONE_NUMBER

const client=twilio(accountSid,authToken)

const sndSMS = async(to,body) => {
    try {
        const message=await client.messages.create({
            body,
            from:twilioPhone,
            to
        })
        console.log(`SMS sent to ${to}:SID ${message.sid}`)
        return {success:true, sid:message.sid}
    } catch (error) {
            console.error("❌ Error sending SMS:", error.message);
    return { success: false, error: error.message };
        
    }
  
}

export default sndSMS

