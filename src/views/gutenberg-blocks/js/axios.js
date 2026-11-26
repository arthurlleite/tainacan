import axios from 'axios';
import { guardRestRequest } from '../../admin/js/rest-request-guard';
import { tunnelRestMethod } from '../../admin/js/rest-method-tunnel';

const tainacanApi = axios.create({
    baseURL: tainacan_blocks.root
});

if (tainacan_blocks.nonce) {
    tainacanApi.defaults.headers.common['X-WP-Nonce'] = tainacan_blocks.nonce;
}
tainacanApi.interceptors.request.use(tunnelRestMethod);
tainacanApi.interceptors.request.use(guardRestRequest);

export default tainacanApi;