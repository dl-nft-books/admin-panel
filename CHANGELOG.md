# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [1.5.1] - 2023-08-15
#### Changed
- Interaction with providers moved on [@distributedlab/w3p](https://github.com/distributed-lab/web-kit/tree/main/packages/w3p)
- Book types refactored

## [1.5.0] - 2023-05-12
#### Added
- Deploying/editing on multiple chains at once
- Contract-based pagination
- Role manager
- Withdrawals page
- Vouchers page

#### Changed
- New contracts
- 1 book on different chains now related as 1 single book
- Book info now gathering from 2 sources: contracts and backend
- Main app font

## [1.4.0-rc.1]
#### Added
- Floor price for nft books
- Tabs in sale history for erc-20 payments and NFT exchange payments

#### Changed
- Typography refactored
- All components refactored to script setup style
- All components refactored to 'template -> script -> style' pattern
- Refactored composable folder structure

#### Fixed
- Overflowing horizontal scroll on nft page

#### Removed
- useContext hook

## [1.3.0] - 2023-02-01
#### Added
- Vouchers fields to NFT-Create and NFT-Update forms
- Networks switching

#### Changed
- Contracts updated

## [1.2.0] - 2022-12-26
#### Added
- Promocodes page

#### Changed
- Hook use-paginate now works with reactive values, that allows to use filters etc.
- Search feature now works on input change
- Hook use-paginate now works with reactive values, that allows to use filters etc.
- Using use-context hook instead of calling useI18n every time and specifying scope
- Validating name, NFT symbol and description now requires only Latin chars and numbers

#### Fixed
- Nft long title now displays correct
- Drop down overlap fixed
- Field price validation
- Sidebar scrollbars
- Logout dropdown
- Sales history dropdown
- OG meta tags

#### Removed
- Unused sidebar menu items

## [1.1.0] - 2022-12-02
#### Added
- Edit NFT page

## [1.0.0] - 2022-11-30
#### Added
- File field
- Create NFT page
- Create NFT logic

#### Changed
- App colors
- Auth flow

#### Fixed
- A bug with a scrollable sidebar
- A bug with logo
- A bug with different width in create book form

#### Under the hood changes
- Merged from https://gitlab.com/distributed_lab/frontend/vue-template/-/commit/905e060b66b4fbdfa4bf102ac6c27e8edd11dbc2

[Unreleased]: https://github.com/dl-nft-books/admin-panel/compare/v1.5.1...main
[1.5.1]: https://github.com/dl-nft-books/admin-panel/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/dl-nft-books/admin-panel/compare/v1.4.0-rc.1...v1.5.0
[1.4.0-rc.1]: https://github.com/dl-nft-books/admin-panel/compare/v1.3.0...v1.4.0-rc.1
[1.3.0]: https://github.com/dl-nft-books/admin-panel/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/dl-nft-books/admin-panel/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/dl-nft-books/admin-panel/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/dl-nft-books/admin-panel/tree/v1.0.0
