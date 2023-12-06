import { getCurrentTranslation } from "@/components/utils";
import { StyledHeader } from "@/styles/styled";

const texts = getCurrentTranslation();

const Error = () => {
    return (
        <>
            <StyledHeader>
                {texts.error.page_not_exist}
            </StyledHeader>
        </>
    );
};

export default Error;