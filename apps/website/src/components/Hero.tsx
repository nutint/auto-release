import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const StyledBox = styled("div")(({ theme: muiTheme }) => {
  const process = {
    env: { TEMPLATE_IMAGE_URL: undefined },
  };
  const theme = { ...muiTheme, vars: undefined };

  return {
    alignSelf: "center",
    width: "100%",
    height: 400,
    marginTop: theme.spacing(8),
    borderRadius: (theme.vars || theme).shape.borderRadius,
    outline: "6px solid",
    outlineColor: "hsla(220, 25%, 80%, 0.2)",
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.grey[200],
    boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
    backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || "https://mui.com"}/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
    backgroundSize: "cover",
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(10),
      height: 700,
    },
    ...theme.applyStyles("dark", {
      boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
      backgroundImage: `url(${process.env.TEMPLATE_IMAGE_URL || "https://mui.com"}/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
      outlineColor: "hsla(220, 20%, 42%, 0.1)",
      borderColor: (theme.vars || theme).palette.grey[700],
    }),
  };
});

type Props = {
  heroSection: { headline: string; subHeadline: string };
};

export default function Hero(props: Props) {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",

        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
            }}
          >
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Auto
            </Typography>
            -
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              Release
            </Typography>
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            {props.heroSection.subHeadline}
          </Typography>
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
