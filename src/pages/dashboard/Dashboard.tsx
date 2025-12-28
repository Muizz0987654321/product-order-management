import { Card, CardContent, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <div>
      <Typography variant="h5" component="div" sx={{ py: 2 }}>
        Welcome to the Dashboard!
      </Typography>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Overview of your application
          </Typography>
          <Typography variant="body2">
            Here you can find various statistics and insights about your data.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
