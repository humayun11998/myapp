<x-profile :sharedData="$sharedData" doctitle="Who {{$sharedData['username']}}'s Follows">
    @include('profile-following-only')
</x-profile>
