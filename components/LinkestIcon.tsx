import Button from "@mui/material/Button";
import Link from "next/link";

export default function LinkestLogo() {
    return (
        <Link href="/" className="mr-12">
            <Button color="primary" variant="text">
                <p className=" font-bold italic ">🔗 Linkest</p>
            </Button>
        </Link>
    );
}
