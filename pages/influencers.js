
import InfluencerList from '../components/InfluencerList'
import CreateInfluencer from '../components/CreateInfluencer'
import withData from '../lib/withData'


export default withData(() =>
  <div>
    <CreateInfluencer />
    <InfluencerList />
  </div>
)
