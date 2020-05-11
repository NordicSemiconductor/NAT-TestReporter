import * as React from 'react'
import { useState } from 'react'
import { Authenticator, UsernameAttributes } from 'aws-amplify-react'
import { Auth } from 'aws-amplify'
import { ICredentials } from '@aws-amplify/core'
import { signUpWithEmailFields } from 'aws-amplify-react/lib/Auth/common/default-sign-up-fields'

export const Authenticate = ({ children }: React.PropsWithChildren<any>) => {
	const [credentials, setCredentials] = useState<ICredentials>()
	return (
		<>
			<Authenticator
				onStateChange={(authState: string) => {
					if (authState === 'signedIn') {
						Auth.currentCredentials()
							.then((creds) => {
								const c = Auth.essentialCredentials(creds)
								setCredentials(c)
							})
							.catch(console.error)
					} else if (authState === 'signIn') {
						setCredentials(undefined)
					}
				}}
				signUpConfig={{
					signUpFields: signUpWithEmailFields,
				}}
				usernameAttributes={UsernameAttributes.EMAIL}
			/>
			{credentials && (
				<CredentialsContext.Provider value={credentials}>
					{children}
				</CredentialsContext.Provider>
			)}
		</>
	)
}

const CredentialsContext = React.createContext<ICredentials>({
	accessKeyId: '',
	sessionToken: '',
	secretAccessKey: '',
	identityId: '',
	authenticated: false,
})
export const CredentialsConsumer = CredentialsContext.Consumer