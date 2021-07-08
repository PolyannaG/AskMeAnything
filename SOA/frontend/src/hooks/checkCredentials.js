export default async function checkCredentials(username,password){
    try{
        const resp=await fetch('https://manageuserssoa.herokuapp.com/authentication/login',{
            method: 'POST',
            headers:{'Content-type':'application/json'},
            credentials:'include',
            body: JSON.stringify({
                username : username,
                password : password
            })

        })
        // console.log(resp)
        //console.log(resp)

        if (!resp.ok) console.log("resp of login not ok")

        if (resp.ok){
            const response=await resp.json()
            console.log(response.message)
            localStorage.setItem('token', response.message)
            return true
        }
        else if (resp.status===400){
            const response=await resp.json()
            console.log(response)
            return false
        }

    }
    catch (err){
        console.log(err)
    }
}