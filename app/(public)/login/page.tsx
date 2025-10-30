import { SignedOut, SignIn,SignedIn} from "@clerk/nextjs";

export default function Login(){
    return(
        <div className="flex items-center justify-center align-middle">
            <SignedOut>
                <SignIn routing='hash'/>
            </SignedOut>
            <SignedIn>

            </SignedIn>
        </div>
    )
}